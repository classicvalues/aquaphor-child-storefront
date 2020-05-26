/*
class SystemComponent {
  constructor(props) {}

  create() {}
}

class System {
  constructor(props) {}

  create() {}

  clearWater(parametrs) {}
}
*/

function main() {
  // ?add-to-cart=548
  //  const urlReq = 'aquaphor.store/?add-to-cart=548';
  // const req = new Request(urlReq, { method: 'POST' });
  /*
  fetch(req).then((res) => res.json()).then((res) => console.log(res)).catch((err) => {
    console.log(err);
  });
 //  fetch(req).then((res) => res.json(console.log(res)));
  */ //  fetch(req).then((res) => res.json(console.log(res)));

  console.log(window.filters);
  const equipmentSelectionForm = document.querySelector('.equipment-selection__form');
  const waterPoints = equipmentSelectionForm.pa_water_points;
  const equipmentSelectionWaterPointsLabel = equipmentSelectionForm.querySelector(
    'label.equipment-selection__choice-color_water-points'
  );
  const equipmentSelectionCalculateBtn = equipmentSelectionForm.querySelector(
    '.equipment-selection__calculate-button'
  );
  // Radio button
  const paClearTurbidityRadioBtn = equipmentSelectionForm.pa_clear_turbidity;
  const choiceTasteRadioBtn = equipmentSelectionForm.choiceTaste;

  const equipmentSelectionTable = equipmentSelectionForm.querySelector(
    '.equipment-selection__table'
  );
  // Все input в таблице
  const allTableInputs = equipmentSelectionTable.querySelectorAll(
    '.equipment-selection__elem-value'
  );
  // Сообщение о провале операции :=)
  const equipmentSelectionDescriptionNoResult = document.querySelector(
    '.equipment-selection__description_no-result'
  );

  function renderResultSystem(waterSystemFull) {
    const resultsContainer = document.querySelector('.results__container');
    for (let i = 0; i < 8; i += 1) {
      if (waterSystemFull[i]) {
        resultsContainer.insertAdjacentHTML(
          'beforeend',
          `<div class="card">
          <img src="${waterSystemFull[i].urlPic}" class="card__pic">
          <h4 class=card__title>${waterSystemFull[i].product.name}</h4>
          <p class="card__price">${waterSystemFull[i].product.price} руб.</p>
          </div>
      `
        );
      } else {
        resultsContainer.insertAdjacentHTML(
          'beforeend',
          `<div class="card">
          </div>
      `
        );
      }
    }
  }

  function changeWaterPoints() {
    switch (Number(waterPoints.value)) {
      case 1:
        equipmentSelectionWaterPointsLabel.textContent = 'одна';
        break;
      case 2:
        equipmentSelectionWaterPointsLabel.textContent = 'две';
        break;
      case 3:
        equipmentSelectionWaterPointsLabel.textContent = 'три';
        break;
      case 4:
        equipmentSelectionWaterPointsLabel.textContent = 'четыре';
        break;
      case 5:
        equipmentSelectionWaterPointsLabel.textContent = 'пять';
        break;
      case 6:
        equipmentSelectionWaterPointsLabel.textContent = 'шесть';
        break;
      default:
        equipmentSelectionWaterPointsLabel.textContent = 'одна';
    }
  }

  function inputEquipmentSelectionForm() {
    equipmentSelectionCalculateBtn.disabled = true;
    let valid = true;
    if (paClearTurbidityRadioBtn.value !== '' && choiceTasteRadioBtn.value !== '') {
      // нет ни одного такого, что пуст или не приобразуется в число
      valid = !Object.keys(allTableInputs).some(
        (index) =>
          Number.isNaN(Number(allTableInputs[index].value)) || allTableInputs[index].value === ''
      );
    } else valid = false;
    if (valid) {
      equipmentSelectionCalculateBtn.disabled = false;
    }
  }

  function submitEquipmentSelectionForm(event) {
    const dataForm = [];
    dataForm.push({
      name: paClearTurbidityRadioBtn[0].name,
      value: paClearTurbidityRadioBtn.value,
    });
    dataForm.push({ name: choiceTasteRadioBtn[0].name, value: choiceTasteRadioBtn.value });
    dataForm.push({ name: waterPoints.name, value: waterPoints.value });
    Object.keys(allTableInputs).forEach((index) =>
      dataForm.push({
        name: allTableInputs[index].name,
        value: allTableInputs[index].value,
      })
    );
    /** проверяем все введеные в форму значения на соответствие диапазона каждого аттрибута
     * каждой системы. Затем берем только те системы, у которых все атрибуты подходят
     * под введеные значения, далее если есть системы то сортируем и ищем с наименьшей
     * стоимостью, нет выводим сообщение */
    for (let i = 0; i < window.systems.length; i += 1) {
      for (let j = 0; j < window.systems[i].attributes.length; j += 1) {
        // Если у атрибута нет мин - макс числовых значений, то пропускаем его
        if (
          !Number.isNaN(Number(window.systems[i].attributes[j][3])) &&
          !Number.isNaN(Number(window.systems[i].attributes[j][4]))
        ) {
          for (let k = 2; k < dataForm.length; k += 1) {
            if (dataForm[k].name === window.systems[i].attributes[j][2]) {
              if (
                Number(window.systems[i].attributes[j][3] <= Number(dataForm[k].value)) &&
                Number(dataForm[k].value) <= Number(window.systems[i].attributes[j][4])
              ) {
                if (window.systems[i].attributes[j].length > 4) {
                  window.systems[i].attributes[j][5] = true;
                } else window.systems[i].attributes[j].push(true);
              } else if (window.systems[i].attributes[j][5]) {
                window.systems[i].attributes[j][5] = false;
              } else window.systems[i].attributes[j].push(false);
            }
          }
        }
      }
    }
    const okSystems = [];
    for (let i = 0; i < window.systems.length; i += 1) {
      let valid = true;
      for (let j = 0; j < window.systems[i].attributes.length; j += 1) {
        if (window.systems[i].attributes[j].length > 4) {
          if (!window.systems[i].attributes[j][5]) {
            valid = false;
          }
        }
      }
      if (valid) {
        okSystems.push(window.systems[i]);
        window.systems[i].valid = true;
      } else window.systems[i].valid = false;
    }
    // 0 система оптимальна
    okSystems.sort((a, b) => Number(a.product.price) - Number(b.product.price));
    // рисуем систему в html
    const waterSystemFull = [];
    if (okSystems.length > 0) {
      equipmentSelectionForm.style.display = 'none';
      waterSystemFull.push(window.filterCases[0]);
      switch (Number(paClearTurbidityRadioBtn.value)) {
        case 1:
          waterSystemFull.push(window.filters[0]);
          break;
        case 2:
          waterSystemFull.push(window.filters[1]);
          break;
        default:
          waterSystemFull.push(window.filters[0]);
      }
      waterSystemFull.push(okSystems[0]);
      waterSystemFull.push(window.filters[0]);
      waterSystemFull.push(window.filterCases[0]);

      if (choiceTasteRadioBtn.value === '1') {
        waterSystemFull.push(window.filterCases[0]);
      }
      renderResultSystem(waterSystemFull);
    } else {
      equipmentSelectionForm.style.display = 'none';
      equipmentSelectionDescriptionNoResult.style.display = 'block';
    }

    event.preventDefault();
  }
  // бегунок
  waterPoints.addEventListener('change', changeWaterPoints);
  // ввод на форме
  equipmentSelectionForm.addEventListener('input', inputEquipmentSelectionForm);
  // submit формы
  equipmentSelectionForm.addEventListener('submit', submitEquipmentSelectionForm);
}

main();
