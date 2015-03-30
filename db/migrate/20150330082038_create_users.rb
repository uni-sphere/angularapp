class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :access
      t.string :access_alias
      t.string :email
      t.integer :organization_id

      t.timestamps
    end
  end
end
