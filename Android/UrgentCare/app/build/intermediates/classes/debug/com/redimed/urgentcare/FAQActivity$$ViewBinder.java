// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class FAQActivity$$ViewBinder<T extends com.redimed.urgentcare.FAQActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558486, "field 'btnCloseFAQPage'");
    target.btnCloseFAQPage = finder.castView(view, 2131558486, "field 'btnCloseFAQPage'");
  }

  @Override public void unbind(T target) {
    target.btnCloseFAQPage = null;
  }
}
