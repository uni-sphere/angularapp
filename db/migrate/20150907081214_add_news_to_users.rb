class AddNewsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :news, :boolean, default: false
  end
end