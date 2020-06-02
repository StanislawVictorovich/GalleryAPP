void function () {
  const endpointUrl = 'https://api.npoint.io/f310dbb82460d4c81542';
  const options = {
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
      dictionary: ['ru', 'en'],
      value: 0
    }
  };
  let usersData = null;

  $(document).ready(function () {
    updateViewOptions();

    /**
     * Radio-buttons logic in the options-block
     */
    $('.radio-button').on('click', function(e) {
      const optionName = $(this).text().toLowerCase();
      const groupName = $(this).parent().attr('class').toLowerCase();

      groupName === 'view'
        ? options[groupName].value = options[groupName].dictionary.indexOf(optionName)
        : options.sorting[groupName].value = options.sorting[groupName].dictionary.indexOf(optionName);
      
      $(this).parent().children().removeClass('active');
      $(this).addClass('active');

      sortTableModel();
      updateTableView();
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
    const type = options.sorting.type.dictionary[options.sorting.type.value];
    const direction = options.sorting.direction.dictionary[options.sorting.direction.value];
    const view = options.view.dictionary[options.view.value];
    
    $(`.radio-button.${type}, .radio-button.${direction}, .radio-button.${view}`).addClass('active');
  }

  /**
   * Fills table on view from the model
   */
  function updateTableView() {
    $('.users-table').text('');
    $.each(usersData, function(index, value) {
      const cardTableTemplate = $('.templates .card-table').clone();
      cardTableTemplate.find('.image>img').attr('src', `images/${value.image}.svg`);
      cardTableTemplate.find('.name').text(value.name.en);
      cardTableTemplate.find('.age').text(value.age);
      cardTableTemplate.find('.phone').text(value.phone);
      cardTableTemplate.appendTo('.users-table');
    });
  }

  /**
   * Sorts table by selected options from the model
   */
  function sortTableModel() {
    const type = options.sorting.type.dictionary[options.sorting.type.value];
    const direction = options.sorting.direction.dictionary[options.sorting.direction.value];
    
    //usersData.sort((a, b) => a.age < b.age);

    console.log(type, direction);

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

    console.log(usersData);
  }
}();
