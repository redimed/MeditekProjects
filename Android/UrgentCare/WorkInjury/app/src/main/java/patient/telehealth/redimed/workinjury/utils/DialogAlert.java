package patient.telehealth.redimed.workinjury.utils;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.CardView;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;


import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.R;

/**
 * Created by Fox on 9/25/2015.
 */
public class DialogAlert extends Dialog {

    @Bind(R.id.dialogBackground)
    CardView dialogBackground;
    @Bind(R.id.dialogIcon)
    ImageView dialogIcon;
    @Bind(R.id.dialogMessage)
    TextView dialogMessage;
    @Bind(R.id.dialogBtnClose)
    Button dialogBtnClose;

    private State state;
    private String message = "";
    private Context context;

    public static enum State {
        Success,
        Error,
        Warning
    }

    public DialogAlert(Context c, State s, String m) {
        super(c);
        this.context = c;
        this.state = s;
        this.message = m;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.custom_alert_dialog);
        ButterKnife.bind(this);

        dialogBtnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        if (state.equals(State.Success)) {
            dialogBackground.setCardBackgroundColor(ContextCompat.getColor(context, R.color.success));
            dialogIcon.setImageResource(R.drawable.icon_success);
        } else if (state.equals(State.Error)) {
            dialogBackground.setCardBackgroundColor(ContextCompat.getColor(context, R.color.error));
            dialogIcon.setImageResource(R.drawable.icon_close_error);
        } else if (state.equals(State.Warning)) {
            dialogBackground.setCardBackgroundColor(ContextCompat.getColor(context, R.color.warning));
            dialogIcon.setImageResource(R.drawable.icon_warning);
        }
        dialogMessage.setText(message);
    }
}
