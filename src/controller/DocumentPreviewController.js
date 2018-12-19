const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController {

    constructor(file) {

        this._file = file;
        
    }

 
    getPreviewData() {

        return new Promise((s, f) => {

            const tipos = ["image/", "audio/", "video/", "application/pdf"];
            let tipo = "";

            tipos.forEach(element => {            
                if (this._file.type.startsWith(element)) {
                    tipo = element;
                }
            });
    
            let reader = new FileReader();

            switch (tipo) {
                case "image/":
                    
                    reader.onload = e => {
                        s({
                            src: reader.result,
                            info: this._file.name
                        });
                    }

                    reader.onerror = e => {
                        f(e);
                    }

                    reader.readAsDataURL(this._file);

                    break;

                case "application/pdf":

                    reader.onload = e => {
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf => {

                            pdf.getPage(1).then(page => {
                                
                                let viewport = page.getViewport(1);
                                let canvas = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(() => {
                                    
                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} página${(pdf.numPages > 1 ? 's' : '')}`
                                    });

                                }).catch(err => {
                                    f(err);
                                });

                            }).catch(err => {
                                f(err);
                            });

                        }).catch(err => {
                            f(err);
                        });
                    }

                    reader.readAsArrayBuffer(this._file);
                    break;

                default:
                    f();

            }

        });
    }
}