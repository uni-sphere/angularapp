class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.integer :organization_id
      t.boolean :activity_reports, default: true

      t.timestamps
    end
  end
end
