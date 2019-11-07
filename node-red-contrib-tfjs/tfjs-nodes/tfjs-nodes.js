
module.exports = function (RED) {
  let tf = null

  const initTfjs = function (node) {
    const globalContext = node.context().global
    if (!tf) {
      tf = globalContext.get('tfjs')
    }
    if (!tf) {
      tf = require('@tensorflow/tfjs-node')
      globalContext.set('tfjs', tf)
      node.log(`Loaded TensorFlow.js v${tf.version.tfjs}`)
    }
  }

  const loadModel = async function (modelUrl, modelType, node) {
    node.status({
      fill: 'yellow',
      shape: 'dot',
      text: `Loading a ${modelType} model...`
    })

    if (modelType === 'layers') {
      node.model = await tf.loadLayersModel(modelUrl)
    } else if (modelType === 'graph') {
      node.model = await tf.loadGraphModel(modelUrl)
    }

    if (node.model) {
      const shape = node.model.inputs[0].shape.map(v => {
        return (v && v > -1) ? v : 1
      })
      // warm up
      node.model.predict(tf.zeros(shape)).dispose()

      node.log(`Model Input: rank=${node.model.inputs[0].rank}, shape=[${node.model.inputs[0].shape}]`)

      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'Model is ready'
      })
    } else {
      node.status({
        fill: 'red',
        shape: 'dot',
        text: 'No model loaded'
      })
    }
  }

  const computeTargetSize = function (config, width, height) {
    let size = {
      width: width,
      height: height
    }
    const maxSize = isNaN(config.maxLength) ? -1 : parseInt(config.maxLength)
    if (maxSize > 0) {
      const resizeRatio = maxSize / Math.max(width, height)
      size = {
        width: Math.round(resizeRatio * width),
        height: Math.round(resizeRatio * height)
      }
    }
    if (config.makeSquare) {
      const max = Math.max(size.width, size.height)
      size = {
        width: max,
        height: max
      }
    }
    return size
  }

  const resizeImageTensor = function (config, t, size) {
    let s = size
    if (config.makeSquare && size.width !== size.height) {
      const max = Math.max(size.width, size.height)
      s = {
        width: max,
        height: max
      }
    }
    return tf.tidy(() => {
      // rescale the image to fit the wanted shape
      const scaled = tf.image.resizeBilinear(t, [s.width, s.height], true)
      const offset = tf.scalar(127.5)
      // Normalize the image from [0, 255] to [-1, 1].
      return scaled.sub(offset).div(offset)
    })
  }

  const TFJSPredictNode = function (config) {
    initTfjs(this)

    RED.nodes.createNode(this, config)
    const node = this

    loadModel(config.model, config.modelType, node)

    node.on('input', function (msg) {
      try {
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'running inference...'
        })

        let inputTensor = null

        if (Array.isArray(msg.payload)) {
          inputTensor = tf.tensor(msg.payload)
        } else if (typeof msg.payload === 'object') {
          if (msg.payload.contextId) {
            inputTensor = node.context().global.get(msg.payload.contextId)
          } else if (msg.payload.values && Array.isArray(msg.payload.values)) {
            inputTensor = tf.tensor(msg.payload.values)
          }
        }

        if (inputTensor) {
          const outputTensor = node.model.predict(inputTensor)
          msg.payload = {
            dtype: outputTensor.dtype,
            rank: outputTensor.rank,
            shape: outputTensor.shape,
            size: outputTensor.size,
            values: outputTensor.dataSync()
          }
          node.status({})
          node.send(msg)
        } else {
          node.status({
            fill: 'red',
            shape: 'dot',
            text: ''
          })
          node.error('No input tensor provided')
        }
      } catch (error) {
        node.status({
          fill: 'red',
          shape: 'dot',
          text: ''
        })
        node.error(error, msg)
      }
    })

    node.on('close', function () {
    })
  }

  const TFJSImageToTensorNode = function (config) {
    initTfjs(this)
    const fs = require('fs')

    RED.nodes.createNode(this, config)
    const node = this
    node.on('input', function (msg) {
      try {
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'processing image...'
        })

        const p = (typeof msg.payload === 'string') ? fs.readFileSync(msg.payload) : msg.payload
        // TODO: something better?
        const imgTensorId = `image-to-tensor-${Date.now()}`

        const imgTensor = tf.tidy(() => {
          let t = tf.node.decodeImage(p)
          const w = t.rank === 3 ? t.shape[0] : t.shape[1]
          const h = t.rank === 3 ? t.shape[1] : t.shape[2]

          const size = computeTargetSize(config, w, h)
          t = resizeImageTensor(config, t, size)

          if (config.precision === 'float32') {
            t = t.cast('float32')
          }
          if (config.dimensions === '4d' && t.shape.length === 3) {
            t = t.expandDims()
          }
          return t
        })

        node.context().global.set(imgTensorId, imgTensor)
        // TODO: trying using flow context instead
        // node.context().flow.set(imgTensorId, imgTensor)

        msg.payload = {
          dtype: imgTensor.dtype,
          rank: imgTensor.rank,
          shape: imgTensor.shape,
          size: imgTensor.size,
          contextId: imgTensorId
        }

        if (config.includeValues) {
          msg.payload.values = imgTensor.dataSync()
        }

        node.status({})
        node.send(msg)
      } catch (error) {
        node.error(error, msg)
        node.status({
          fill: 'red',
          shape: 'dot',
          text: ''
        })
      }
    })

    node.on('close', function () {
    })
  }

  RED.nodes.registerType('tfjs-model-predict', TFJSPredictNode)
  RED.nodes.registerType('tfjs-image-to-tensor', TFJSImageToTensorNode)
}
