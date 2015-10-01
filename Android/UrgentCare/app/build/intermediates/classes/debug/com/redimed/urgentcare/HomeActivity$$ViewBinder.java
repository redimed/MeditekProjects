// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class HomeActivity$$ViewBinder<T extends com.redimed.urgentcare.HomeActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558489, "field 'btnMakeAppointment'");
    target.btnMakeAppointment = finder.castView(view, 2131558489, "field 'btnMakeAppointment'");
    view = finder.findRequiredView(source, 2131558486, "field 'btnSportInjury'");
    target.btnSportInjury = finder.castView(view, 2131558486, "field 'btnSportInjury'");
    view = finder.findRequiredView(source, 2131558487, "field 'btnWorkInjury'");
    target.btnWorkInjury = finder.castView(view, 2131558487, "field 'btnWorkInjury'");
    view = finder.findRequiredView(source, 2131558488, "field 'btnFAQ'");
    target.btnFAQ = finder.castView(view, 2131558488, "field 'btnFAQ'");
    view = finder.findRequiredView(source, 2131558483, "field 'imgLogoRedimed'");
    target.imgLogoRedimed = finder.castView(view, 2131558483, "field 'imgLogoRedimed'");
    view = finder.findRequiredView(source, 2131558482, "field 'imgBackgroundHome'");
    target.imgBackgroundHome = finder.castView(view, 2131558482, "field 'imgBackgroundHome'");
  }

  @Override public void unbind(T target) {
    target.btnMakeAppointment = null;
    target.btnSportInjury = null;
    target.btnWorkInjury = null;
    target.btnFAQ = null;
    target.imgLogoRedimed = null;
    target.imgBackgroundHome = null;
  }
}
