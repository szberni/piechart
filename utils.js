export const calculateRadius = (xDiff, yDiff) => {
  return Math.sqrt(xDiff**2 + yDiff**2);
}

const calculateRadian = (opposite, adjacent) => {
  return Math.atan(opposite / adjacent);
}

export const calculateAngle = (xDiff, yDiff) => {
  if (yDiff === 0) {
    return (xDiff > 0) ? 0 : Math.PI;
  }
  if (yDiff > 0) {
    return Math.PI / 2 - calculateRadian(xDiff, yDiff);
  }
  if (yDiff < 0 && xDiff >= 0) {
    return -Math.PI / 2 - calculateRadian(xDiff, yDiff);
  }
  if (yDiff < 0 && xDiff < 0) {
    return 3 / 2 * Math.PI - calculateRadian(xDiff, yDiff);
  }
}

export const calculateAngles = (chartItems) => {
  const totalValue = chartItems.reduce((sum, item) => sum + item.value, 0);
  const convertedChartItems = [];
  let startAngle = -Math.PI / 2;

  for (const item of chartItems) {
    const percent = item.value / totalValue;
    const endAngle = startAngle + percent * 2 * Math.PI;

    const convertedItem = {
      ...item,
      percent,
      startAngle,
      endAngle,
    }

    convertedChartItems.push(convertedItem);
    startAngle = endAngle;
  }

  return convertedChartItems;
}
