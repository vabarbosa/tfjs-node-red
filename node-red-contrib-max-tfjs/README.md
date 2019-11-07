# node-red-contrib-max-tfjs

A collection of MAX models for TensorFlow.js that have been turned into custom Node-RED nodes.

## Install

The nodes can be installed using the Node-RED editor or NPM CLI

From the Node-RED editor,

1. Click the Node-RED Menu icon 
1. Click **Manage Palette**
1. Select **Palette** tab
1. Select **Install** tab

From the command line,

1. Go into the Node-RED user directory (`~/.node-red`)
    ```
    cd ~/.node-red
    ```
1. Install the nodes (using the full directory path)
    ```
    npm install <full path>/node-red-contrib-max-tfjs
    ```

## Usage

1. Add the node to the flow
1. Wire the input and output accordingly

## Nodes

| Name | Description |
|--|--|
| max-human-pose-estimator | Detect humans in an image and identifies the body parts |
| max-image-segmenter | Identify objects in an image and assigns each pixel of the image to a particular object |
|  |  |

## Resources

- [Node-RED](https://nodered.org/)
- [TensorFlow.js](https://www.tensorflow.org/js/)
- [MAX TensorFlow.js Models](https://github.com/CODAIT/max-tfjs-models)
