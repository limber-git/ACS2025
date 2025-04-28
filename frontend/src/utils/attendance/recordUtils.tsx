export function extractHour(timeTable: string) {
  const parts = timeTable.split(" ");
  return parts.length > 1 ? parts[1] : timeTable;
}

export function formatDateEnglish(dateStr: string) {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      if (fileReader.result) {
        resolve(fileReader.result as string);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getFileAsBase64 = async (file: File): Promise<string> => {
  if (file.type.startsWith("image/")) {
    return convertToBase64(file);
  } else if (file.type === "application/pdf") {
    return convertToBase64(file);
  }
  throw new Error(`Unsupported file type: ${file.type}`);
};