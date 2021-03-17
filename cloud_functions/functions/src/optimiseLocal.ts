import * as imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";

imagemin(["logos/*"], {
  destination: "logos/optimised",
  plugins: [imageminPngquant({ quality: [0.6, 0.8] })]
}).catch();
