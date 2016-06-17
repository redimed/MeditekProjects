package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by MeditekMini on 6/7/16.
 */
public class GridItemView extends FrameLayout {

    @Bind(R.id.txtRedisite)
    TextView txtRedisite;

    public GridItemView(Context context) {
        super(context);
        LayoutInflater.from(context).inflate(R.layout.cardview_item_grid_view, this);
        ButterKnife.bind(this, getRootView());
    }

    public void display(String text, boolean isSelected) {
        txtRedisite.setText(text);
        display(isSelected);
    }

    public void display(boolean isSelected) {
        txtRedisite.setBackgroundResource(isSelected ? R.color.colorPrimary : 0);
        txtRedisite.setTextColor(ContextCompat.getColor(getContext(), isSelected ? R.color.lightFont : R.color.greyFont));
    }
}
