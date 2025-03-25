export default async function getCroppedImg(imageSrc, crop, maxSizeKB = 400) {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    let quality = 0.9;
    let base64 = canvas.toDataURL('image/jpeg', quality);
    while (base64.length / 1024 > maxSizeKB && quality > 0.3) {
        quality -= 0.05;
        base64 = canvas.toDataURL('image/jpeg', quality);
    }
    return base64;
}
