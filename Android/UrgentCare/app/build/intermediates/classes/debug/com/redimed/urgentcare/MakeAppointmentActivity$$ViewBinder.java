// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class MakeAppointmentActivity$$ViewBinder<T extends com.redimed.urgentcare.MakeAppointmentActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558503, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131558503, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131558505, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131558505, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131558507, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131558507, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131558511, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131558511, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131558513, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131558513, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131558515, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131558515, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131558518, "field 'radioGroupGPReferral'");
    target.radioGroupGPReferral = finder.castView(view, 2131558518, "field 'radioGroupGPReferral'");
    view = finder.findRequiredView(source, 2131558501, "field 'scrollViewMakeAppointment'");
    target.scrollViewMakeAppointment = finder.castView(view, 2131558501, "field 'scrollViewMakeAppointment'");
    view = finder.findRequiredView(source, 2131558499, "field 'rippleViewCloseMakeAppointmentPage'");
    target.rippleViewCloseMakeAppointmentPage = finder.castView(view, 2131558499, "field 'rippleViewCloseMakeAppointmentPage'");
    view = finder.findRequiredView(source, 2131558523, "field 'rippleViewBtnMakeAppointment'");
    target.rippleViewBtnMakeAppointment = finder.castView(view, 2131558523, "field 'rippleViewBtnMakeAppointment'");
    view = finder.findRequiredView(source, 2131558509, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131558509, "field 'autoCompleteSuburb'");
    view = finder.findRequiredView(source, 2131558522, "field 'checkboxHandTherapy'");
    target.checkboxHandTherapy = finder.castView(view, 2131558522, "field 'checkboxHandTherapy'");
    view = finder.findRequiredView(source, 2131558520, "field 'checkboxPhysiotherapy'");
    target.checkboxPhysiotherapy = finder.castView(view, 2131558520, "field 'checkboxPhysiotherapy'");
    view = finder.findRequiredView(source, 2131558521, "field 'checkboxSpecialist'");
    target.checkboxSpecialist = finder.castView(view, 2131558521, "field 'checkboxSpecialist'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.radioGroupGPReferral = null;
    target.scrollViewMakeAppointment = null;
    target.rippleViewCloseMakeAppointmentPage = null;
    target.rippleViewBtnMakeAppointment = null;
    target.autoCompleteSuburb = null;
    target.checkboxHandTherapy = null;
    target.checkboxPhysiotherapy = null;
    target.checkboxSpecialist = null;
  }
}
