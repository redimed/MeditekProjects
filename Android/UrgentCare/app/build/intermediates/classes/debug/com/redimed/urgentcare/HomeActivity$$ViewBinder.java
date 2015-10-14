// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class HomeActivity$$ViewBinder<T extends com.redimed.urgentcare.HomeActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558491, "field 'imgLogoRedimed'");
    target.imgLogoRedimed = finder.castView(view, 2131558491, "field 'imgLogoRedimed'");
    view = finder.findRequiredView(source, 2131558490, "field 'imgBackgroundHome'");
    target.imgBackgroundHome = finder.castView(view, 2131558490, "field 'imgBackgroundHome'");
    view = finder.findRequiredView(source, 2131558494, "field 'rippleViewSportInjury'");
    target.rippleViewSportInjury = finder.castView(view, 2131558494, "field 'rippleViewSportInjury'");
    view = finder.findRequiredView(source, 2131558495, "field 'rippleViewWorkInjury'");
    target.rippleViewWorkInjury = finder.castView(view, 2131558495, "field 'rippleViewWorkInjury'");
    view = finder.findRequiredView(source, 2131558496, "field 'rippleViewFAQ'");
    target.rippleViewFAQ = finder.castView(view, 2131558496, "field 'rippleViewFAQ'");
    view = finder.findRequiredView(source, 2131558497, "field 'rippleViewMakeAppointment'");
    target.rippleViewMakeAppointment = finder.castView(view, 2131558497, "field 'rippleViewMakeAppointment'");
    view = finder.findRequiredView(source, 2131558493, "field 'rippleViewCallUs'");
    target.rippleViewCallUs = finder.castView(view, 2131558493, "field 'rippleViewCallUs'");
  }

  @Override public void unbind(T target) {
    target.imgLogoRedimed = null;
    target.imgBackgroundHome = null;
    target.rippleViewSportInjury = null;
    target.rippleViewWorkInjury = null;
    target.rippleViewFAQ = null;
    target.rippleViewMakeAppointment = null;
    target.rippleViewCallUs = null;
  }
}
