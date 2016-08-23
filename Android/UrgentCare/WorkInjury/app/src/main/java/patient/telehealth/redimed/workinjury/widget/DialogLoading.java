package patient.telehealth.redimed.workinjury.widget;

import android.content.Context;
import android.graphics.Color;


import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.R;

/**
 * Created by MeditekPro on 7/11/16.
 */
public class DialogLoading {

    private Context context;
    private SweetAlertDialog progressDialog;

    public DialogLoading(Context context) {
        this.context = context;
    }

    public void showLoadingDialog() {
        if (progressDialog == null) {
            progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
            progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
            progressDialog.setTitleText(context.getResources().getString(R.string.loading));
            progressDialog.setCancelable(false);
        }
        progressDialog.show();
    }

    public void dismissLoadingDialog() {
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.dismiss();
        }
    }
}
