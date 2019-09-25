$(document).ready(function() {
    // AJAX functions for Inventory form
    if ( $("#id_deployment option").length == 1 ) {
        $("#div_id_deployment").hide();
    }  else {
        $("#div_id_deployment").show();
    }

    if ( $("#id_assembly_part option").length == 1 ) {
        $("#div_id_assembly_part").hide();
    }  else {
        $("#div_id_assembly_part").show();
    }

    if ( $("#id_parent option").length == 1 ) {
        $("#div_id_parent").hide();
    }  else {
        $("#div_id_parent").show();
    }

    $("#hint_id_serial_number").click(function () {
        $("#id_serial_number").removeAttr("readonly");
    });

    $("#inventory-filter-form-part-number").on("submit", function(){
      var url = $(this).attr("data-url");
      var url_serialnumber = $(this).attr("data-serialnumber-url");
      var partNumber = $("#part_number_search").val();
      var url_revisions = $("#inventory-action-form").attr("data-revisions-url");
      $.ajax({
          url: url,
          data: {
            "part_number": partNumber
          },
          success: function (data) {
            $("#id_part").html(data);
            // Now send another AJAX request to update Revisions
            var partID = $("#id_part").val();
            console.log(partID);
            $.ajax({
                url: url_revisions,
                data: {
                  "part_id": partID
                },
                success: function (data) {
                  $("#id_revision").html(data);
                }
            });
          }
      });
      $.ajax({
          url: url_serialnumber,
          data: {
            "part_number": partNumber
          },
          success: function (data) {
            $("#div_id_serial_number div").html(data);
          }
      });
      return false;
    })

    $("#id_part_type").change(function () {
        var url = $("#inventory-filter-form").attr("data-url");
        var partType = $(this).val();
        $.ajax({
            url: url,
            data: {
              'part_type': partType
            },
            success: function (data) {
              $("#id_part").html(data);
            }
        });
    });

    $("#id_part").change(function () {
        var url_serialnumber = $("#inventory-action-form").attr("data-serialnumber-url");
        var url_revisions = $("#inventory-action-form").attr("data-revisions-url");
        var partID = $(this).val();

        if ( $( "#id_location" ).length ) {
            var locationID = $("#id_location").val();
        }  else {
            var locationID;
        }

        $.ajax({
            url: url_revisions,
            data: {
              "part_id": partID
            },
            success: function (data) {
              $("#id_revision").html(data);
            }
        });

        $.ajax({
            url: url_serialnumber,
            data: {
              "part_id": partID
            },
            success: function (data) {
              $("#div_id_serial_number div").html(data);
            }
        });

    });

});
