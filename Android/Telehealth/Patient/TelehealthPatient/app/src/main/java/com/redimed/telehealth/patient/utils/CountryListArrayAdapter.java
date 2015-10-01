package com.redimed.telehealth.patient.utils;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.CountryCodeActivity;
import com.redimed.telehealth.patient.R;

import java.util.List;

/**
 * Created by Fox on 9/24/2015.
 */
public class CountryListArrayAdapter extends ArrayAdapter<CountryCodeActivity.Country> {

    private final List<CountryCodeActivity.Country> listCountryActivity;
    private final Activity context;

    static class ViewHolder {
        protected TextView name;
        protected ImageView flag;
    }

    public CountryListArrayAdapter(Activity countryCodeActivity, List<CountryCodeActivity.Country> countryList) {
        super(countryCodeActivity, R.layout.activity_country_code, countryList);
        this.listCountryActivity = countryList;
        this.context = countryCodeActivity;
    }

    //Display Country Name, Code and Flag
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View viewCountry = null;

        if (viewCountry == null){
            LayoutInflater inflater = context.getLayoutInflater();
            viewCountry = inflater.inflate(R.layout.activity_country_code, null);
            final ViewHolder viewHolder = new ViewHolder();
            viewHolder.name = (TextView) viewCountry.findViewById(R.id.countryName);
            viewHolder.flag = (ImageView) viewCountry.findViewById(R.id.countryFlag);
            viewCountry.setTag(viewHolder);
        }
        else {
            viewCountry = convertView;
        }

        ViewHolder holder = (ViewHolder) viewCountry.getTag();
        holder.name.setText(listCountryActivity.get(position).getName());
        holder.flag.setImageDrawable(listCountryActivity.get(position).getFlag());
        return viewCountry;
    }
}
