package com.redimed.telehealth.patient.faq.presenter;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IFAQsPresenter {

    void backToHome(Boolean flag);

    void contentFAQs(Bundle bundle);
}
