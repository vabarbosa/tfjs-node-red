
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

  const TFJSCocoSSD = function (config) {
    initTfjs(this)
    const fs = require('fs')
    const cocoSsd = require('@tensorflow-models/coco-ssd')

    RED.nodes.createNode(this, config)
    const node = this

    node.status({
      fill: 'yellow',
      shape: 'dot',
      text: 'Loading model...'
    })

    cocoSsd.load().then(model => {
      node.model = model
      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'Model is ready'
      })
      node.log('Coco SSD Model Loaded.')
    })

    const runPrediction = async function (img, msg) {
      const inputTensor = tf.node.decodeImage(img)
      msg.payload = await node.model.detect(inputTensor)
      msg.shape = inputTensor.shape
      inputTensor.dispose()
      msg.classes = {}
      for (let i = 0; i < msg.payload.length; i++) {
        msg.classes[msg.payload[i].class] = (msg.classes[msg.payload[i].class] || 0) + 1
      }
      node.send(msg)
    }

    node.on('input', function (msg) {
      try {
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'running inference...'
        })

        const p = (typeof msg.payload === 'string') ? fs.readFileSync(msg.payload) : msg.payload
        runPrediction(p, msg)
        node.status({})
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

  RED.nodes.registerType('tfjs-coco-ssd', TFJSCocoSSD)
}
