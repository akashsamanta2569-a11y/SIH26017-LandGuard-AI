export const usePrintReport = () => {
  const exportPDF = () => {
    const report = document.getElementById("landguard-report");

    document.body.classList.add("printing");

    if (report) {
      report.setAttribute("data-print-root", "true");
    }

    requestAnimationFrame(() => {
      window.print();

      window.addEventListener(
        "afterprint",
        () => {
          document.body.classList.remove("printing");

          if (report) {
            report.removeAttribute("data-print-root");
          }
        },
        { once: true }
      );
    });
  };

  // Allow both direct function call `exportPDF()` and property destructuring `{ exportPDF, printReport }`
  exportPDF.exportPDF = exportPDF;
  exportPDF.printReport = exportPDF;

  return exportPDF;
};

export default usePrintReport;