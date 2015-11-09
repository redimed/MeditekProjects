// Generated code from Butter Knife. Do not modify!
package patient.telehealth.redimed.workinjury;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class HomeActivity$$ViewBinder<T extends patient.telehealth.redimed.workinjury.HomeActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131492990, "field 'slider'");
    target.slider = finder.castView(view, 2131492990, "field 'slider'");
    view = finder.findRequiredView(source, 2131492991, "field 'circleIndicator'");
    target.circleIndicator = finder.castView(view, 2131492991, "field 'circleIndicator'");
    view = finder.findRequiredView(source, 2131492997, "field 'btnCall'");
    target.btnCall = finder.castView(view, 2131492997, "field 'btnCall'");
    view = finder.findRequiredView(source, 2131492999, "field 'btnFAQ'");
    target.btnFAQ = finder.castView(view, 2131492999, "field 'btnFAQ'");
    view = finder.findRequiredView(source, 2131492998, "field 'btnUrgent'");
    target.btnUrgent = finder.castView(view, 2131492998, "field 'btnUrgent'");
    view = finder.findRequiredView(source, 2131492993, "field 'btnRehab'");
    target.btnRehab = finder.castView(view, 2131492993, "field 'btnRehab'");
    view = finder.findRequiredView(source, 2131492994, "field 'btnSpec'");
    target.btnSpec = finder.castView(view, 2131492994, "field 'btnSpec'");
    view = finder.findRequiredView(source, 2131492995, "field 'btnGP'");
    target.btnGP = finder.castView(view, 2131492995, "field 'btnGP'");
    view = finder.findRequiredView(source, 2131492996, "field 'btnOther'");
    target.btnOther = finder.castView(view, 2131492996, "field 'btnOther'");
  }

  @Override public void unbind(T target) {
    target.slider = null;
    target.circleIndicator = null;
    target.btnCall = null;
    target.btnFAQ = null;
    target.btnUrgent = null;
    target.btnRehab = null;
    target.btnSpec = null;
    target.btnGP = null;
    target.btnOther = null;
  }
}
