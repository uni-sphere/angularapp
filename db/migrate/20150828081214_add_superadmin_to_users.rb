class AddSuperadminToUsers < ActiveRecord::Migration
  def change
    add_column :users, :archived, :superadmin, default: false
  end
end