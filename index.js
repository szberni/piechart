import { colors } from './constants.js';
import { PieChart } from './PieChart.js';

const root = document.querySelector('#root');

// CHART

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'Pie Chart';

const chartContainer = document.createElement('div');
chartContainer.id = 'chartContainer';

const chartBlock = document.createElement('div');
chartBlock.classList.add('chart-block');
chartBlock.append(title, chartContainer);

const pieChart = new PieChart(chartContainer, colors);

// FORM

const formGroups = [];

for (const color of colors) {
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.setAttribute('value', `#${color.id}`);
  colorInput.disabled = true;

  const numberInput = document.createElement('input');
  numberInput.type = 'number';
  numberInput.setAttribute('value', color.value);
  numberInput.style.backgroundColor = `#${color.id}20`;
  numberInput.disabled = true;

  const formGroup = document.createElement('div');
  formGroup.id = color.id;
  formGroup.classList.add('color-form-item');
  formGroup.append(colorInput, numberInput);

  formGroups.push(formGroup);
}

formGroups.forEach((group) => {
  group.addEventListener('mouseenter', (e) => {
    pieChart.setFocusedItemById(e.target?.id);
  })

  group.addEventListener('mouseleave', (e) => {
    pieChart.setFocusedItemById(null);
  })
});

const form = document.createElement('form');
form.classList.add('color-form');
form.append(...formGroups);

root.append(chartBlock, form);
