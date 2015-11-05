// Generated code from Butter Knife. Do not modify!
package patient.telehealth.redimed.sportinjury;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class FAQsActivity$$ViewBinder<T extends patient.telehealth.redimed.sportinjury.FAQsActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131492986, "field 'webViewFAQs'");
    target.webViewFAQs = finder.castView(view, 2131492986, "field 'webViewFAQs'");
  }

  @Override public void unbind(T target) {
    target.webViewFAQs = null;
  }
}
