Template.itemCategoryEdit.rendered = function() {
    if (!Modernizr.inputtypes.color) {
        $('input[type=color]').replaceWith('<input type="text" id="picker" class="colorPick"></input>');
        $('#picker').colpick({
            layout:'hex',
            submit:0,
            colorScheme:'dark',
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                $(el).css('border-color','#' + hex);
                // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                if(!bySetColor) $(el).val('#' + hex);
            }
        }).keyup(function(){
            $(this).colpickSetColor(this.value);
        });
    }
};

Template.itemCategoryEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            itemCategory = {};

        var result = Meteor.bindFormData(itemCategory, formData);
        ItemCategories.update(this._id, {$set: result});
        $('#modalEditor').foundation('reveal', 'close');
    }
});
