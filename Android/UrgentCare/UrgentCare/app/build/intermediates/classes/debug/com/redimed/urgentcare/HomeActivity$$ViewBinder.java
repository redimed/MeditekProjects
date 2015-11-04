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
    view = finder.findRequiredView(source, 2131558496, "field 'rippleViewOrthopaedic'");
    target.rippleViewOrthopaedic = finder.castView(view, 2131558496, "field 'rippleViewOrthopaedic'");
    view = finder.findRequiredView(source, 2131558493, "field 'rippleViewPlasticInjury'");
    target.rippleViewPlasticInjury = finder.castView(view, 2131558493, "field 'rippleViewPlasticInjury'");
    view = finder.findRequiredView(source, 2131558497, "field 'rippleViewCallUs'");
    target.rippleViewCallUs = finder.castView(view, 2131558497, "field 'rippleViewCallUs'");
    view = finder.findRequiredView(source, 2131558499, "field 'btnFaq'");
    target.btnFaq = finder.castView(view, 2131558499, "field 'btnFaq'");
    view = finder.findRequiredView(source, 2131558498, "field 'btnUrgentCare'");
    target.btnUrgentCare = finder.castView(view, 2131558498, "field 'btnUrgentCare'");
  }

  @Override public void unbind(T target) {
    target.imgLogoRedimed = null;
    target.imgBackgroundHome = null;
    target.rippleViewSportInjury = null;
    target.rippleViewWorkInjury = null;
    target.rippleViewOrthopaedic = null;
    target.rippleViewPlasticInjury = null;
    target.rippleViewCallUs = null;
    target.btnFaq = null;
    target.btnUrgentCare = null;
  }
}
