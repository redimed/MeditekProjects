package com.redimed.telehealth.patient.utils;

import android.content.Context;
import android.content.Intent;
import android.media.Image;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.redimed.telehealth.patient.ProfilePatientActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.Category;

import java.util.List;

/**
 * Created by Lam on 10/7/2015.
 */
public class RVAdapter extends RecyclerView.Adapter<RVAdapter.CategoriesViewHolder> {

    private List<Category> categories;
    private Context context;
    private DrawerLayout drawerCategories;

    public RVAdapter(List<Category> arrCategories){
        categories = arrCategories;
    }

    @Override
    public CategoriesViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_drawer_menu, parent, false);
        CategoriesViewHolder categoriesViewHolder = new CategoriesViewHolder(view);
        return categoriesViewHolder;
    }

    @Override
    public void onBindViewHolder(CategoriesViewHolder holder, final int position) {
        holder.imgTitle.setImageResource(categories.get(position).getScrImg());
        holder.lblTitle.setText(categories.get(position).getTitle());
        holder.imgIcon.setImageResource(categories.get(position).getIcon());
        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String selectItem = categories.get(position).getTitle();
                Log.d("Name", selectItem);
                switch (selectItem){
                    case "Information":
                        v.getContext().startActivity(new Intent(v.getContext(), ProfilePatientActivity.class));
                        break;
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }

    public static class CategoriesViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView imgTitle;
        TextView lblTitle;
        ImageView imgIcon;

        public CategoriesViewHolder(View itemView) {
            super(itemView);
            cardView = (CardView) itemView.findViewById(R.id.cardViewCategory);
            imgTitle = (ImageView) itemView.findViewById(R.id.imgTitle);
            lblTitle = (TextView) itemView.findViewById(R.id.lblTitle);
            imgIcon = (ImageView) itemView.findViewById(R.id.imgIcon);
        }
    }
}
