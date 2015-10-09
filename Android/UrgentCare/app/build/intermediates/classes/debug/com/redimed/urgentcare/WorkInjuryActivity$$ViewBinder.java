// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class WorkInjuryActivity$$ViewBinder<T extends com.redimed.urgentcare.WorkInjuryActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558504, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131558504, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131558506, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131558506, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131558508, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131558508, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131558512, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131558512, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131558514, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131558514, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131558516, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131558516, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131558521, "field 'radioGroupUrgentRequestType'");
    target.radioGroupUrgentRequestType = finder.castView(view, 2131558521, "field 'radioGroupUrgentRequestType'");
    view = finder.findRequiredView(source, 2131558528, "field 'scrollViewWorkInjury'");
    target.scrollViewWorkInjury = finder.castView(view, 2131558528, "field 'scrollViewWorkInjury'");
    view = finder.findRequiredView(source, 2131558527, "field 'btnCloseWorkInjuryPage'");
    target.btnCloseWorkInjuryPage = finder.castView(view, 2131558527, "field 'btnCloseWorkInjuryPage'");
    view = finder.findRequiredView(source, 2131558495, "field 'btnWorkInjury'");
    target.btnWorkInjury = finder.castView(view, 2131558495, "field 'btnWorkInjury'");
    view = finder.findRequiredView(source, 2131558510, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131558510, "field 'autoCompleteSuburb'");
    view = finder.findRequiredView(source, 2131558526, "field 'imgBackgroundWorkInjury'");
    target.imgBackgroundWorkInjury = finder.castView(view, 2131558526, "field 'imgBackgroundWorkInjury'");
    view = finder.findRequiredView(source, 2131558533, "field 'txtCompanyName'");
    target.txtCompanyName = finder.castView(view, 2131558533, "field 'txtCompanyName'");
    view = finder.findRequiredView(source, 2131558535, "field 'txtContactPerson'");
    target.txtContactPerson = finder.castView(view, 2131558535, "field 'txtContactPerson'");
    view = finder.findRequiredView(source, 2131558537, "field 'txtCompanyPhone'");
    target.txtCompanyPhone = finder.castView(view, 2131558537, "field 'txtCompanyPhone'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.radioGroupUrgentRequestType = null;
    target.scrollViewWorkInjury = null;
    target.btnCloseWorkInjuryPage = null;
    target.btnWorkInjury = null;
    target.autoCompleteSuburb = null;
    target.imgBackgroundWorkInjury = null;
    target.txtCompanyName = null;
    target.txtContactPerson = null;
    target.txtCompanyPhone = null;
  }
}
