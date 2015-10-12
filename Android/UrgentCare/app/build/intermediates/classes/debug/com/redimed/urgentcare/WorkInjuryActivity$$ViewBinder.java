// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class WorkInjuryActivity$$ViewBinder<T extends com.redimed.urgentcare.WorkInjuryActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558506, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131558506, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131558508, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131558508, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131558510, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131558510, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131558514, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131558514, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131558516, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131558516, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131558518, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131558518, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131558523, "field 'radioGroupUrgentRequestType'");
    target.radioGroupUrgentRequestType = finder.castView(view, 2131558523, "field 'radioGroupUrgentRequestType'");
    view = finder.findRequiredView(source, 2131558530, "field 'scrollViewWorkInjury'");
    target.scrollViewWorkInjury = finder.castView(view, 2131558530, "field 'scrollViewWorkInjury'");
    view = finder.findRequiredView(source, 2131558540, "field 'rippleViewBtnWorkInjury'");
    target.rippleViewBtnWorkInjury = finder.castView(view, 2131558540, "field 'rippleViewBtnWorkInjury'");
    view = finder.findRequiredView(source, 2131558528, "field 'rippleViewCloseWorkInjuryPage'");
    target.rippleViewCloseWorkInjuryPage = finder.castView(view, 2131558528, "field 'rippleViewCloseWorkInjuryPage'");
    view = finder.findRequiredView(source, 2131558512, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131558512, "field 'autoCompleteSuburb'");
    view = finder.findRequiredView(source, 2131558535, "field 'txtCompanyName'");
    target.txtCompanyName = finder.castView(view, 2131558535, "field 'txtCompanyName'");
    view = finder.findRequiredView(source, 2131558537, "field 'txtContactPerson'");
    target.txtContactPerson = finder.castView(view, 2131558537, "field 'txtContactPerson'");
    view = finder.findRequiredView(source, 2131558539, "field 'txtCompanyPhone'");
    target.txtCompanyPhone = finder.castView(view, 2131558539, "field 'txtCompanyPhone'");
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
    target.rippleViewBtnWorkInjury = null;
    target.rippleViewCloseWorkInjuryPage = null;
    target.autoCompleteSuburb = null;
    target.txtCompanyName = null;
    target.txtContactPerson = null;
    target.txtCompanyPhone = null;
  }
}
