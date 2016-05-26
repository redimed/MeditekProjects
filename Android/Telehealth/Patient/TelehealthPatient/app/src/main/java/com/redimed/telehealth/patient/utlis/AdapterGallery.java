package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

/**
 * Created by Fox on 1/25/2016.
 */
public class AdapterGallery extends BaseAdapter {

    private Context context;
    private LayoutInflater inflater;
    private boolean isActionMultiplePick;
    private ArrayList<CustomGallery> data;
    private String TAG = "=====GALLERY_ADAPTER=====";

    public AdapterGallery(Context context) {
        this.context = context;

        data = new ArrayList<CustomGallery>();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return data.size();
    }

    @Override
    public CustomGallery getItem(int position) {
        return data.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    public void setMultiplePick(boolean isMultiplePick) {
        this.isActionMultiplePick = isMultiplePick;
    }

    public void selectAll(boolean selection) {
        for (int i = 0; i < data.size(); i++) {
            data.get(i).isSelected = selection;

        }
        notifyDataSetChanged();
    }

    public boolean isAllSelected() {
        boolean isAllSelected = true;
        for (int i = 0; i < data.size(); i++) {
            if (!data.get(i).isSelected) {
                isAllSelected = false;
                break;
            }
        }
        return isAllSelected;
    }

    public boolean isAnySelected() {
        boolean isAnySelected = false;
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).isSelected) {
                isAnySelected = true;
                break;
            }
        }
        return isAnySelected;
    }

    public void addAll(ArrayList<CustomGallery> files) {
        try {
            this.data.clear();
            this.data.addAll(files);

        } catch (Exception e) {
            e.printStackTrace();
        }
        notifyDataSetChanged();
    }

    public ArrayList<CustomGallery> getSelected() {
        ArrayList<CustomGallery> dataT = new ArrayList<CustomGallery>();
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).isSelected) {
                dataT.add(data.get(i));
            }
        }
        return dataT;
    }

    public void changeSelection(View v, int position) {
        if (data.get(position).isSelected) {
            data.get(position).isSelected = false;
        } else {
            data.get(position).isSelected = true;
        }
        ((ViewHolder) v.getTag()).imgQueueMultiSelected.setSelected(data.get(position).isSelected);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        final ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.gridview_item_gallery, null);

            holder = new ViewHolder();
            holder.imgQueue = (ImageView) convertView.findViewById(R.id.imgQueue);
            holder.imgQueueMultiSelected = (ImageView) convertView.findViewById(R.id.imgQueueMultiSelected);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        try {
            Glide.with(context).load("file://" + data.get(position).sdcardPath)
                    .centerCrop()
                    .into(holder.imgQueue);

            if (isActionMultiplePick) {
                holder.imgQueueMultiSelected.setSelected(data.get(position).isSelected);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return convertView;
    }

    public class ViewHolder {
        ImageView imgQueue;
        ImageView imgQueueMultiSelected;
    }

    public void clear() {
        data.clear();
        notifyDataSetChanged();
    }
}
