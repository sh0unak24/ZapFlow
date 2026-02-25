export function parse(
    text: string,
    values: any,
    startDelimeter = "{",
    endDelimeter = "}"
  ) {
    // ✅ LOGIC GUARD (this fixes your crash)
    if (!text) return "";
  
    let startIndex = 0;
    let finalString = "";
  
    while (startIndex < text.length) {
      if (text[startIndex] === startDelimeter) {
        let endPoint = startIndex + 1;
  
        while (endPoint < text.length && text[endPoint] !== endDelimeter) {
          endPoint++;
        }
  
        if (endPoint >= text.length) {
          finalString += text[startIndex];
          startIndex++;
          continue;
        }
  
        const stringHoldingValue = text.slice(startIndex + 1, endPoint);
        const keys = stringHoldingValue.split(".");
  
        let localValues = values;
        console.log("Resolving", stringHoldingValue, "→", localValues);
        for (let i = 0; i < keys.length; i++) {
          if (typeof localValues === "string") {
            localValues = JSON.parse(localValues);
          }
          localValues = localValues?.[keys[i]];
        }
  
        finalString += localValues ?? "";
        startIndex = endPoint + 1;
      } else {
        finalString += text[startIndex];
        startIndex++;
      }
      
    }
    
    return finalString;
  }