"use strict";

/* Aliases for sanity */
const $ = document.querySelector.bind(document);
const $a = document.querySelectorAll.bind(document);
const $$ = document.createElement.bind(document);

const form = $("form");
const dimensions = $("#dimensions");
const width = $("#width");
const height = $("#height");
const longside = $("#longside");
const longLength = $("#longLength");
const percentage = $("#percentage");
const value = $("#value");
const choose = $("#choose");
const png = $("#png");
const jpeg = $("#jpeg");
const quality = $("#quality");
const canvas = $$("canvas");
const ctx = canvas.getContext("2d");
const preview = $("#preview");
const prevew_ctx = preview.getContext("2d");
const reader = new FileReader();
const image = new Image();
let lastExportedBlob;

function chooseImage(){
    const file = this.files[0];
    reader.readAsDataURL(file);
    // display current file type, size
}

function setImage(){
    image.src = reader.result;
}

function showPreview(){
    const natW = image.naturalWidth;
    const natH = image.naturalHeight;
    preview.height = 100;
    preview.width = (preview.height * natW) / natH;
    prevew_ctx.drawImage(image,0,0,preview.width,preview.height);
    width.value = natW;
    height.value = natH;
    longLength.value = Math.max(natW, natH);
    // display current dimensions
}

function doResize(){
    let newWidth = image.naturalWidth;
    let newHeight = image.naturalHeight;
    if(dimensions.checked){
        newWidth = width.value;
        newHeight = height.value;
    } else if (longside.checked) {
        const longest = longLength.value;
        const factor = (newWidth>newHeight) ? newWidth / longest : newHeight / longest;
        newWidth = newWidth / factor;
        newHeight = newHeight / factor;
    } else if (percentage.checked) {
        newWidth = newWidth * (value.value / 100);
        newHeight = newHeight * (value.value / 100);
    }
    newWidth = Math.floor(newWidth);
    newHeight = Math.floor(newHeight);
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image,0,0,newWidth,newHeight);
}

function makePNG(e){
    doExport(e, "image/png");
}

function makeJPEG(e){
    doExport(e, "image/jpeg");
}

function doExport(event, format){
    if(!form.checkValidity()){
        form.reportValidity();
        return;
    }
    doResize();
    canvas.toBlob(openExport, format, quality.value / 100);
    event.preventDefault();
}

function openExport(blob){
    window.URL.revokeObjectURL(lastExportedBlob);
    lastExportedBlob = window.URL.createObjectURL(blob);
    window.open(lastExportedBlob, "_blank");
}

choose.addEventListener("change", chooseImage, false);
reader.addEventListener("load", setImage);
image.addEventListener("load", showPreview);

png.addEventListener("click", makePNG);
jpeg.addEventListener("click", makeJPEG);
