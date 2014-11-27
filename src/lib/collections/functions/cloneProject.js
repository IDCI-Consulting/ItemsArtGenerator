/*
 * Clone a model for a new project
 *
 * @param model: The model which we are going to clone
 *
 * @return the new project with model's data
 */

Meteor.cloneProject = function(model) {
    var categories = ItemCategories.find({projectId: model._id}).fetch();
    var items = Items.find({projectId: model._id}).fetch();
    var itemsMap = {};
    var categoriesMap = {};
    var project = {
        _id: new Meteor.Collection.ObjectID()._str,
        createdAt: new Date().getTime(),
        background: model.background,
        type: model.type,
        authors: [Meteor.userId()]
    };
    Projects.insert(project);

    _.each(items, function(item, key) {
        var newItem = {
            _id: new Meteor.Collection.ObjectID()._str,
            name: item.name,
            description: item.description,
            options: item.options,
            projectId: project._id
        };
        Items.insert(newItem);
        itemsMap[item._id] = newItem._id;
    });

    _.each(categories, function(category, key) {
        var newCategory = {
            _id: new Meteor.Collection.ObjectID()._str,
            name: category.name,
            description: category.description,
            options: category.options,
            projectId: project._id
        }
        ItemCategories.insert(newCategory);
        categoriesMap[category._id] = newCategory._id;
    });

    _.each(items, function(item, key) {
        _.each(item.categories, function(categoryId, categoryKey) {
            item.categories[categoryKey] = categoriesMap[categoryId];
        })
        Items.update(itemsMap[item._id], {$set: {categories: item.categories}});
    })

    _.each(categories, function(category, key) {
        _.each(category.items, function(itemId, position) {
            category.items[position] = itemsMap[itemId];
        });
        ItemCategories.update(categoriesMap[category._id], {$set: {items: category.items}});
    });

    return project;
};
