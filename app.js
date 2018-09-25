//Storage Controller

//Item Controller
const ItemCtrl = (function() {
  //console.log('Item Controller!!!!');
  //Item Constructor
  const Item = function(it, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //data structure / state
  const data = {
    items: [
      { id: 0, name: 'Stack Dinner', calories: 1200 },
      { id: 1, name: ' Cookies', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  //public method
  return {
    logData: function() {
      return data;
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  //public method
  return {};
})();
//App Controller
const App = (function(ItemCtrl, UICtrl) {
  //Public method
  return {
    init: function() {
      console.log('Initializing App...');
    }
  };
})(ItemCtrl, UICtrl);

//initializing App
App.init();
