void function () {
  const endpointUrl = 'https://api.npoint.io/f310dbb82460d4c81542';
  let options = {
    sorting: {
      type: {
        dictionary: ['id', 'name', 'age'],
        value: 0
      },
      direction: {
        dictionary: ['ascending', 'descending'],
        value: 0
      }
    },
    view: {
      dictionary: ['table', 'preview'],
      value: 0
    },
    i18n: {
      dictionary: ['en', 'ru'],
      value: 0
    }
  };
  let usersData = null;
  const i18nOptions = {
    id: {
      en: 'Id',
      ru: 'Айди'
    },
    name: {
      en: 'Name',
      ru: 'Имя'
    },
    age: {
      en: 'Age',
      ru: 'Возраст'
    },
    ascending: {
      en: 'Ascending',
      ru: 'По-возрастанию'
    },
    descending: {
      en: 'Descending',
      ru: 'По-убыванию'
    },
    table: {
      en: 'Table',
      ru: 'Таблица'
    },
    preview: {
      en: 'Preview',
      ru: 'Превью'
    },
    en: {
      en: 'EN',
      ru: 'АНГЛ'
    },
    ru: {
      en: 'RU',
      ru: 'РУС'
    }
  }

  $(document).ready(function () {
    updateViewOptions();

    /**
     * Radio-buttons logic in the options-block
     */
    $('.radio-button').on('click', function(e) {
      const optionName = getButtonName($(this).attr('class'));
      const groupName = $(this).parent().attr('class').toLowerCase();

      groupName === 'view' || groupName === 'i18n'
        ? options[groupName].value = options[groupName].dictionary.indexOf(optionName)
        : options.sorting[groupName].value = options.sorting[groupName].dictionary.indexOf(optionName);
      
      $(this).parent().children().removeClass('active');
      $(this).addClass('active');

      sortTableModel();
      updateTableView();
      saveOptions();
    });

    getUserData()
      .then(data => {
        usersData = data;
        sortTableModel();
        updateTableView();
      });
  });

  /**
   * Gets user data from the end point
   * @returns promise with array of users data
   */
  function getUserData() {
    return fetch(endpointUrl)
      .then(response => response.json());
  }

  /**
   * Updates options block on view from the model
   */
  function updateViewOptions() {
    restoreOptions();

    const type = options.sorting.type.dictionary[options.sorting.type.value];
    const direction = options.sorting.direction.dictionary[options.sorting.direction.value];
    const view = options.view.dictionary[options.view.value];
    const i18n = options.i18n.dictionary[options.i18n.value];
    
    $(`.radio-button.${type}, 
       .radio-button.${direction}, 
       .radio-button.${view}, 
       .radio-button.${i18n}`).addClass('active');
    
    $('.radio-button').each(function (index, element) {
      let buttonName = getButtonName($(element).attr('class'));
      $(`.${buttonName} span`).text(i18nOptions[buttonName][i18n]);
    });
  }

  /**
   * Calculates clear button name from string of classes
   * @param {string} classNames string of class names
   */
  function getButtonName(classNames) {
    classNames = classNames.replace('radio-button', '');
    classNames = classNames.replace('active', '');
    return classNames.trim();
  }
  /**
   * Fills table on view from the model
   */
  function updateTableView() {
    const i18n = options.i18n.dictionary[options.i18n.value];

    $('.users-table').text('');
    
    $('.radio-button').each(function (index, element) {
      let buttonName = getButtonName($(element).attr('class'));
      $(`.${buttonName} span`).text(i18nOptions[buttonName][i18n]);
    });
  
    $.each(usersData, function(index, value) {
      const cardTableTemplate = $('.templates .card-table').clone();
      const cardPreviewTemplate = $('.templates .card-preview').clone();
      const view = options.view.dictionary[options.view.value];
      const i18n = options.i18n.dictionary[options.i18n.value];

      cardTableTemplate.find('.image>img').attr('src', `images/${value.image}.svg`);
      cardPreviewTemplate.find('.image>img').attr('src', `images/${value.image}.svg`);
      cardTableTemplate.find('.name').text(value.name[i18n]);
      cardPreviewTemplate.find('.name').text(value.name[i18n]);
      cardTableTemplate.find('.age').text(value.age);
      cardPreviewTemplate.find('.age').text(value.age);
      cardTableTemplate.find('.phone').text(value.phone);
      cardPreviewTemplate.find('.phone').text(value.phone);
      cardPreviewTemplate.find('.phrase').text(value.phrase[i18n]);

      if (value.video) {
        cardPreviewTemplate.find('video source').attr('src', `videos/${value.image}.mp4`);
        cardPreviewTemplate.addClass('card-preview-video');
      } else {
        cardPreviewTemplate.find('.video').parent().css({ 'display': 'none' });
        cardPreviewTemplate.addClass('card-preview-no-video');
      }
      
      if (view === 'table') {
        cardTableTemplate.appendTo('.users-table');
      } else {
        cardPreviewTemplate.appendTo('.users-table');
      }
    });
  }

  /**
   * Sorts table by selected options from the model
   */
  function sortTableModel() {
    const type = options.sorting.type.dictionary[options.sorting.type.value];
    const direction = options.sorting.direction.dictionary[options.sorting.direction.value];
    
    userData = usersData.sort((a, b) => {
      if (type === 'name') {
        return direction === 'ascending'
          ? a[type].en < b[type].en ? -1 : 1
          : b[type].en < a[type].en ? -1 : 1;
      } else {
        return direction === 'ascending'
          ? a[type] - b[type]
          : b[type] - a[type];
      }
    });

  }
  /**
   * Restores options from the localstorage
   */
  function restoreOptions() {
    const storageOptions = localStorage.getItem('options');
    if (storageOptions) {
      options = JSON.parse(storageOptions);
    }
  }
  /**
   * Saves selected user options to the local storage
   */
  function saveOptions() {
    localStorage.setItem('options', JSON.stringify(options));
  }
}();
