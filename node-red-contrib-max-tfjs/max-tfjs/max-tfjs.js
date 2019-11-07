
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

  const TFJSMaxHumanPoseEstimator = function (config) {
    initTfjs(this)
    const fs = require('fs')
    const poseEstimator = require('@codait/max-human-pose-estimator')

    RED.nodes.createNode(this, config)
    const node = this

    node.status({
      fill: 'yellow',
      shape: 'dot',
      text: 'Loading model...'
    })

    poseEstimator.loadModel().then(model => {
      node.model = model
      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'Model is ready'
      })
      node.log('Human Pose Estimator Model Loaded.')
    })

    const runPrediction = function (img, msg) {
      const inputTensor = tf.node.decodeImage(img).cast('float32').expandDims()
      poseEstimator.runInference(inputTensor)
        .then(poseEstimator.processOutput)
        .then(prediction => {
          inputTensor.dispose()
          msg.payload = prediction
          node.send(msg)
        })
    }

    node.on('input', function (msg) {
      try {
        const p = msg.payload === 'string' ? fs.readFileSync(msg.payload) : msg.payload
        runPrediction(p, msg)
      } catch (error) {
        node.error(error, msg)
      }
    })

    node.on('close', function () {
    })
  }

  RED.nodes.registerType('max-human-pose-estimator', TFJSMaxHumanPoseEstimator)

  const TFJSMaxImageSegmenter = function (config) {
    initTfjs(this)
    const fs = require('fs')
    const imageSegmenter = require('@codait/max-image-segmenter')

    RED.nodes.createNode(this, config)
    const node = this

    node.status({
      fill: 'yellow',
      shape: 'dot',
      text: 'Loading model...'
    })

    imageSegmenter.loadModel().then(model => {
      node.model = model
      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'Model is ready'
      })
      node.log('Image Segmenter Model Loaded.')
    })

    const computeTargetSize = function (width, height) {
      const resizeRatio = 512 / Math.max(width, height)
      return {
        width: Math.round(resizeRatio * width),
        height: Math.round(resizeRatio * height)
      }
    }

    const runPrediction = async function (img, msg) {
      const inputTensor = tf.tidy(() => {
        const imgTensor = tf.node.decodeImage(img)
        const targetSize = computeTargetSize(imgTensor.shape[0], imgTensor.shape[1])
        return imgTensor.resizeBilinear([targetSize.width, targetSize.height]).expandDims()
      })
      imageSegmenter.runInference(inputTensor)
        .then(imageSegmenter.processOutput)
        .then(prediction => {
          inputTensor.dispose()
          msg.payload = prediction
          node.send(msg)
        })
    }

    node.on('input', function (msg) {
      try {
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'running prediction...'
        })
        const p = msg.payload === 'string' ? fs.readFileSync(msg.payload) : msg.payload
        runPrediction(p, msg)
        node.status({})
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

  RED.nodes.registerType('max-image-segmenter', TFJSMaxImageSegmenter)
}
