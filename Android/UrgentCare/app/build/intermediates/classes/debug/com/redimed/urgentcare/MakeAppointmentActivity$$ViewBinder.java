// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class MakeAppointmentActivity$$ViewBinder<T extends com.redimed.urgentcare.MakeAppointmentActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558497, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131558497, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131558499, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131558499, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131558501, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131558501, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131558503, "field 'txtSuburb'");
    target.txtSuburb = finder.castView(view, 2131558503, "field 'txtSuburb'");
    view = finder.findRequiredView(source, 2131558505, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131558505, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131558507, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131558507, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131558509, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131558509, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131558512, "field 'radioGroupGPReferral'");
    target.radioGroupGPReferral = finder.castView(view, 2131558512, "field 'radioGroupGPReferral'");
    view = finder.findRequiredView(source, 2131558514, "field 'radioGroupUrgentRequestType'");
    target.radioGroupUrgentRequestType = finder.castView(view, 2131558514, "field 'radioGroupUrgentRequestType'");
    view = finder.findRequiredView(source, 2131558495, "field 'scrollViewMakeAppointment'");
    target.scrollViewMakeAppointment = finder.castView(view, 2131558495, "field 'scrollViewMakeAppointment'");
    view = finder.findRequiredView(source, 2131558494, "field 'btnCloseMakeAppointmentPage'");
    target.btnCloseMakeAppointmentPage = finder.castView(view, 2131558494, "field 'btnCloseMakeAppointmentPage'");
    view = finder.findRequiredView(source, 2131558489, "field 'btnMakeAppointment'");
    target.btnMakeAppointment = finder.castView(view, 2131558489, "field 'btnMakeAppointment'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtSuburb = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.radioGroupGPReferral = null;
    target.radioGroupUrgentRequestType = null;
    target.scrollViewMakeAppointment = null;
    target.btnCloseMakeAppointmentPage = null;
    target.btnMakeAppointment = null;
  }
}
