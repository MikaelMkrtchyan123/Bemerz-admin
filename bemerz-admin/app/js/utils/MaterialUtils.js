/*******************************************************************************
 * Bemerz Software, Inc. CONFIDENTIAL AND PROPRIETARY
 * FOR USE BY AUTHORIZED PERSONS ONLY
 *
 * This is an unpublished work fully protected by the
 * United States copyright laws and is a trade secret
 * belonging to the copyright holder.
 *
 * Copyright (c) 2016 Bemerz Software Inc.
 * All Rights Reserved.
 *******************************************************************************/

$(document).ready(function() {
  Materialize.updateTextFields();

});

var initActions = {
  initMenu: function () {
    $(".dropdown-button").dropdown();
    /*$('select').material_select();
    $('.modal-trigger').leanModal();*/
  }
};
