package com.redimed.telehealth.patient.faq;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IFAQsPresenter {
    void contentFAQs(Bundle bundle);
    void backToHome(FragmentActivity fragmentActivity);
}
