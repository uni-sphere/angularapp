class AddSuperadminToUsers < ActiveRecord::Migration
  def change
    add_column :users, :archived, :super_admini, default: false
  end
end