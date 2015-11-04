// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class OrthopaedicActivity$$ViewBinder<T extends com.redimed.urgentcare.OrthopaedicActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558505, "field 'txtFirstName'");
    target.txtFirstName = finder.castView(view, 2131558505, "field 'txtFirstName'");
    view = finder.findRequiredView(source, 2131558507, "field 'txtLastName'");
    target.txtLastName = finder.castView(view, 2131558507, "field 'txtLastName'");
    view = finder.findRequiredView(source, 2131558509, "field 'txtContactPhone'");
    target.txtContactPhone = finder.castView(view, 2131558509, "field 'txtContactPhone'");
    view = finder.findRequiredView(source, 2131558513, "field 'txtDOB'");
    target.txtDOB = finder.castView(view, 2131558513, "field 'txtDOB'");
    view = finder.findRequiredView(source, 2131558515, "field 'txtEmail'");
    target.txtEmail = finder.castView(view, 2131558515, "field 'txtEmail'");
    view = finder.findRequiredView(source, 2131558517, "field 'txtDescription'");
    target.txtDescription = finder.castView(view, 2131558517, "field 'txtDescription'");
    view = finder.findRequiredView(source, 2131558520, "field 'radioGroupGPReferral'");
    target.radioGroupGPReferral = finder.castView(view, 2131558520, "field 'radioGroupGPReferral'");
    view = finder.findRequiredView(source, 2131558503, "field 'scrollViewOrthopaedic'");
    target.scrollViewOrthopaedic = finder.castView(view, 2131558503, "field 'scrollViewOrthopaedic'");
    view = finder.findRequiredView(source, 2131558501, "field 'rippleViewCloseOrthopaedicPage'");
    target.rippleViewCloseOrthopaedicPage = finder.castView(view, 2131558501, "field 'rippleViewCloseOrthopaedicPage'");
    view = finder.findRequiredView(source, 2131558525, "field 'rippleViewBtnOrthopaedic'");
    target.rippleViewBtnOrthopaedic = finder.castView(view, 2131558525, "field 'rippleViewBtnOrthopaedic'");
    view = finder.findRequiredView(source, 2131558511, "field 'autoCompleteSuburb'");
    target.autoCompleteSuburb = finder.castView(view, 2131558511, "field 'autoCompleteSuburb'");
    view = finder.findRequiredView(source, 2131558524, "field 'checkboxHandTherapy'");
    target.checkboxHandTherapy = finder.castView(view, 2131558524, "field 'checkboxHandTherapy'");
    view = finder.findRequiredView(source, 2131558522, "field 'checkboxPhysiotherapy'");
    target.checkboxPhysiotherapy = finder.castView(view, 2131558522, "field 'checkboxPhysiotherapy'");
    view = finder.findRequiredView(source, 2131558523, "field 'checkboxSpecialist'");
    target.checkboxSpecialist = finder.castView(view, 2131558523, "field 'checkboxSpecialist'");
  }

  @Override public void unbind(T target) {
    target.txtFirstName = null;
    target.txtLastName = null;
    target.txtContactPhone = null;
    target.txtDOB = null;
    target.txtEmail = null;
    target.txtDescription = null;
    target.radioGroupGPReferral = null;
    target.scrollViewOrthopaedic = null;
    target.rippleViewCloseOrthopaedicPage = null;
    target.rippleViewBtnOrthopaedic = null;
    target.autoCompleteSuburb = null;
    target.checkboxHandTherapy = null;
    target.checkboxPhysiotherapy = null;
    target.checkboxSpecialist = null;
  }
}
