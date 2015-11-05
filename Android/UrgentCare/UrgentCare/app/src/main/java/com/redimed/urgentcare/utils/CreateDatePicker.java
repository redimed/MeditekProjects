package com.redimed.urgentcare.utils;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.DialogFragment;
import android.widget.DatePicker;

/**
 * Created by phanq on 09/16/2015.
 */
public class CreateDatePicker extends DialogFragment implements DatePickerDialog.OnDateSetListener {
//    MakeAppointmentActivity activityMake = (MakeAppointmentActivity) getActivity();
//    SportInjuryActivity activitySport = (SportInjuryActivity) getActivity();
//    WorkInjuryActivity activityWork = (WorkInjuryActivity) getActivity();

    public static interface OnCompleteListener{
        public abstract void onComplete(String date);
    }

    private OnCompleteListener mListener;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        this.mListener = (OnCompleteListener) activity;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        int year = 1990;
        int month = 1;
        int day = 1;


//        if ( activityMake.setDate().length() > 0){
//            StringTokenizer st = new StringTokenizer(activityMake.setDate(),"/");
//            List<Integer> myList = new ArrayList<Integer>();
//            while (st.hasMoreTokens()){
//                myList.add(Integer.parseInt(st.nextToken()));
//            }
//            day = myList.get(0);
//            month = myList.get(1);
//            year = myList.get(2);
//        }
//        if (activitySport.setDate().length() > 0){
//            StringTokenizer st = new StringTokenizer(activitySport.setDate(),"/");
//            List<Integer> myList = new ArrayList<Integer>();
//            while (st.hasMoreTokens()){
//                myList.add(Integer.parseInt(st.nextToken()));
//            }
//            day = myList.get(0);
//            month = myList.get(1);
//            year = myList.get(2);
//        }
//        if (activityWork.setDate().length() > 0){
//            StringTokenizer st = new StringTokenizer(activityWork.setDate(),"/");
//            List<Integer> myList = new ArrayList<Integer>();
//            while (st.hasMoreTokens()){
//                myList.add(Integer.parseInt(st.nextToken()));
//            }
//            day = myList.get(0);
//            month = myList.get(1);
//            year = myList.get(2);
//        }

        return new DatePickerDialog(getActivity(),this,year,month - 1,day);
    }

    @Override
    public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
        this.mListener.onComplete(dayOfMonth + "/" + (monthOfYear + 1) + "/" +year);
    }
}
