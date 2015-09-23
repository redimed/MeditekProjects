package com.example.phanq.meditekapp.utils;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.DialogFragment;
import android.widget.DatePicker;

import com.example.phanq.meditekapp.UngentPage;

/**
 * Created by phanq on 09/16/2015.
 */
public class DatePickerFragment extends DialogFragment implements DatePickerDialog.OnDateSetListener {
    DatePickerDialog dialog;
    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
//        ungentpage.getDate();
        int year = 1990;
        int month = 1;
        int day = 1;
        dialog = new DatePickerDialog(getActivity(),this,year,month,day);
        return dialog;
    }

    @Override
    public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
        int month = monthOfYear + 1;
        String  date = dayOfMonth + "/" + month + "/" +year;
        UngentPage ungentpage = (UngentPage) getActivity();
        ungentpage.setDate(date);
    }
}
