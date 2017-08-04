[![npm version](https://badge.fury.io/js/tgaimage.svg)](https://www.npmjs.com/package/tgaimage)

# TGAImage
TGA Image Loader for Web browsers

## Install

### npm

```
npm install tgaimage --save
```

### without npm

```
<script src="https://cdn.rawgit.com/magicien/TGAImage/v1.0.0/tgaimage.min.js"></script>
```

tgaimage.min.js looks like this;
```
var TGAImage = (function(modules){ ... })()
```
so once you have loaded tgaimage.min.js, you can use TGAImage as a class object.

## Usage

```
// You can load a TGA image with imageWithURL function.
const tga1 = TGAImage.imageWithURL('lena_std.tga')

// didLoad is Promise.
tga1.didLoad.then(() => {

  // You can get an img tag with 'image' property.
  document.getElementById('colorImgTag').appendChild(tga1.image)

  // You can get a canvas tag with 'canvas' property.
  document.getElementById('colorCanvasTag').appendChild(tga1.canvas)
})

// You can also use src and onload properties like HTMLImageElement.
const tga2 = new TGAImage()
tga2.onload = () => {
  document.getElementById('grayscaleImgTag').appendChild(tga2.image)
  document.getElementById('grayscaleCanvasTag').appendChild(tga2.canvas)
}
tga2.src = 'lena_std_grayscale.tga'
```

## Sample

[Sample Page](https://magicien.github.io/TGAImage/sample/)

