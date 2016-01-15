class CreateHandins < ActiveRecord::Migration
  def change
    create_table :handins do |t|
      t.integer :user_id
      t.integer :node_id
      t.integer :assignment_id
      t.integer :organization_id
      t.string :name_user
      t.integer :grade, default: -1
      t.boolean :archived, default: false
      t.timestamps
    end
  end
end
