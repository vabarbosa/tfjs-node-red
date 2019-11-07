# TensorFlow.js Model Assets

This is a list the location of pre-trained models available for TensorFlow.js. What is included are the links to model files (i.e., model.json) and not any specific pre-processing or post-processing code.

As is these model assets may not be very useful unless you know the expected input format and the output produced. However, where possible additional resources is provided where you may find wrapper libraries for the model and/or demos using the model.

Some of these models have multiple versions (i.e., for improved speed or better accuracy), but what is represented here are the default models. Viewing the code from the **Resources** link, in some cases, may provide the link information to the other versions of the model.

## Image Models

| Model | Description | Assets | Additional Resources & Links |
|--|--|--|--|--|
| Arbitrary Style Transfer | Image style transfer | - https://github.com/reiinakano/arbitrary-image-stylization-tfjs/blob/master/saved_model_style_js/model.json <br>- https://github.com/reiinakano/arbitrary-image-stylization-tfjs/raw/ | [GitHub](https://github.com/reiinakano/arbitrary-image-stylization-tfjs) |
| BodyPix (ResNet50 architecture) | Person segmentation | https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/resnet50/float/model-stride16.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) |
| BodyPix (MobileNetV1 architecture) | Person segmentation | https://storage.googleapis.com/tfjs-models/savedmodel/bodypix/mobilenet/float/075/model-stride16.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) |
| COCO-SSD | Object detection | https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) |
| DeepLab v3 | Semantic segmentation | https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json?tfjs-format=file | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/deeplab) |
| Handtrack.js | Hand detection | - https://cdn.jsdelivr.net/npm/handtrackjs/models/web/ssdlitemobilenetv2/tensorflowjs_model.pb <br>- https://cdn.jsdelivr.net/npm/handtrackjs/models/web/ssdlitemobilenetv2/weights_manifest.json | [GitHub](https://github.com/victordibia/handtrack.js) |
| Human Pose Estimator | Human pose estimation | https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-human-pose-estimator/tfjs/0.1.0/model.json | [GitHub](https://github.com/CODAIT/max-tfjs-models/tree/master/human-pose-estimator) |
| Image Segmenter | Image segmentation | https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-image-segmenter/tfjs/0.1.0/model.json | [GitHub](https://github.com/CODAIT/max-tfjs-models/tree/master/image-segmenter) |
| MobileNet V1 | Classify images | https://tfhub.dev/google/imagenet/mobilenet_v1_100_224/classification/1 | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) |
| MobileNet V2 | Classify images | https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2 | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) |
| NSFWJS | Indecent content checking | https://s3.amazonaws.com/ir_public/nsfwjscdn/TFJS_nsfw_mobilenet/tfjs_quant_nsfw_mobilenet/model.json | [GitHub](https://github.com/infinitered/nsfwjs) |
| PoseNet (ResNet50 architecture) | Human pose estimation | https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/float/model-stride16.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/posenet) |
| PoseNet (MobileNetV1 architecture) | Human pose estimation | https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/075/model-stride16.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/posenet) |
| Tiny YOLO | Object detection | https://raw.githubusercontent.com/MikeShi42/yolo-tiny-tfjs/master/model2.json | [GitHub](https://github.com/ModelDepot/tfjs-yolo-tiny) |
|  |  |  |  |

## Audio Models

| Model | Details | Assets | Additional Resources & Links |
|--|--|--|--|
| Speech Command | Classify audio from speech command dataset | https://storage.googleapis.com/tfjs-models/tfjs/speech-commands/v0.3/browser_fft/18w/model.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands) |
|  |  |  |  |

## Text Models

| Model | Details | Assets | Additional Resources & Links |
|--|--|--|--|
| Toxicity | Text toxicity classifier | https://storage.googleapis.com/tfjs-models/savedmodel/toxicity/model.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/toxicity) |
| Universal Sentence Encoder | Text encoding | https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/model.json | [GitHub](https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder), [vocabulary](https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/vocab.json) |
|  |  |  |  |

## Other Models

| Model | Details | Assets | Additional Resources & Links |
|--|--|--|--|
|  |  |  |  |
|  |  |  |  |

