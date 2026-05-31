export async function convertPdfToImage(file: File) {
  try {
    // Prevent SSR execution
    if (typeof window === "undefined") {
      throw new Error("PDF conversion can only run in browser");
    }

    const pdfjsLib = await import("pdfjs-dist");

    const pdfWorker = await import(
      "pdfjs-dist/build/pdf.worker.min.mjs?url"
    );

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context unavailable");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (!blob) {
      throw new Error("Failed to generate image blob");
    }

    return {
      imageUrl: URL.createObjectURL(blob),
      file: new File([blob], "resume.png", {
        type: "image/png",
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      imageUrl: "",
      file: null,
      error: String(err),
    };
  }
}