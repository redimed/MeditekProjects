// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class UrgentCareActivity$$ViewBinder<T extends com.redimed.urgentcare.UrgentCareActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558540, "field 'rippleViewCloseUrgentCarePage'");
    target.rippleViewCloseUrgentCarePage = finder.castView(view, 2131558540, "field 'rippleViewCloseUrgentCarePage'");
  }

  @Override public void unbind(T target) {
    target.rippleViewCloseUrgentCarePage = null;
  }
}
