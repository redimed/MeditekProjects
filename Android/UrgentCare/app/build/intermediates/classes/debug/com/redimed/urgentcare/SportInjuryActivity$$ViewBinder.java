// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class SportInjuryActivity$$ViewBinder<T extends com.redimed.urgentcare.SportInjuryActivity> implements ViewBinder<T> {
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
    view = finder.findRequiredView(source, 2131558519, "field 'radioGroupGPReferral'");
    target.radioGroupGPReferral = finder.castView(view, 2131558519, "field 'radioGroupGPReferral'");
    view = finder.findRequiredView(source, 2131558521, "field 'radioGroupUrgentRequestType'");
    target.radioGroupUrgentRequestType = finder.castView(view, 2131558521, "field 'radioGroupUrgentRequestType'");
    view = finder.findRequiredView(source, 2131558524, "field 'scrollViewSportInjury'");
    target.scrollViewSportInjury = finder.castView(view, 2131558524, "field 'scrollViewSportInjury'");
    view = finder.findRequiredView(source, 2131558523, "field 'btnCloseSportInjuryPage'");
    target.btnCloseSportInjuryPage = finder.castView(view, 2131558523, "field 'btnCloseSportInjuryPage'");
    view = finder.findRequiredView(source, 2131558493, "field 'btnSportInjury'");
    target.btnSportInjury = finder.castView(view, 2131558493, "field 'btnSportInjury'");
    view = finder.findRequiredView(source, 2131558510, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131558510, "field 'autoCompleteSuburb'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.radioGroupGPReferral = null;
    target.radioGroupUrgentRequestType = null;
    target.scrollViewSportInjury = null;
    target.btnCloseSportInjuryPage = null;
    target.btnSportInjury = null;
    target.autoCompleteSuburb = null;
  }
}
