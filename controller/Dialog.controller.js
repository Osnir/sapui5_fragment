sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (JSONModel, Filter, FilterOperator, MessageToast) {
	
	return sap.ui.controller("controller.Dialog", {

		onInit : function () {
			// set explored app's demo model on this sample
			var oModel = new JSONModel("model/Products.json");
			this.getView().setModel(oModel);
		},
	
		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
	
		handleSelectDialogPress: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("sapui5_fragment.fragments.Dialog", this);
				this._oDialog.setModel(this.getView().getModel());
			}
	
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
	
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
	
			// Set growing property
			var bGrowing = oEvent.getSource().data("growing");
			//this._oDialog.setGrowing(bGrowing == "true");
	
			// Set growing threshold
			var sGrowingThreshold = oEvent.getSource().data("threshold");
			if (sGrowingThreshold) {
				this._oDialog.setGrowingThreshold(parseInt(sGrowingThreshold, 10));
			}
	
			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
	
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
	
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
	
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		}
	});
});