import {
    getDesignerAddedFeatureName,
    obtainUpdatedBackgroundAndDesignerFeatures
} from './util';
import { version } from '../package.json';

const exportTheme = (designData, themeName) => {
    const { attributes, features, graphics, positions, previews } = designData.data;

    let theme = Object.assign(
        {},
        {
            graphics,
            features: features
                .map((feature) => Object.assign(
                    {},
                    feature,
                    { positionName: (positions.find(({ id }) => id === feature.position_id).name) }
                )),
            attributes,
            previews
        }
    );

    const ids = function (arr, key) {
        let retarr = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                retarr.push(arr[i][key]);
            }
        }

        return retarr;
    };

    let phid;

    for (let i = 0; i < theme.graphics.length; i++) {
        if (theme.graphics[i].name === 'Placeholder Graphic') {
            phid = theme.graphics[i].id;
            delete theme.graphics[i];
        }
    }

    const themeId = `theme_${designData.metadata.description}_${themeName}`.replace(/\W/g, '_').toLowerCase();

    theme.themes = [
        {
            'id': themeId,
            'design_url': designData.metadata.design_url,
            'product_line_name': designData.metadata.product_line_name,
            'target_name': designData.metadata.target_name,
            'target_category_name': designData.metadata.target_category_name,
            'manufacturer_name': designData.metadata.manufacturer_name,
            'grouped_year': designData.metadata.grouped_year,
            'rule_set_name': designData.metadata.rule_set_name,
            'use_category_name': designData.metadata.use_category_name,
            'use_path': designData.metadata.use_path ? designData.metadata.use_path : null,
            'attribute_ids': ids(theme.attributes, 'link'),
            'feature_ids': ids(theme.features, 'link'),
            'graphic_ids': ids(theme.graphics, 'id')
        }
    ];

    for (let i = 0; i < theme.attributes.length; i++) {
        delete theme.attributes[i].design_id;
        delete theme.attributes[i].rule;

        if (theme.attributes[i].value === phid) {
            delete theme.attributes[i];
        } else if (theme.attributes[i].name === 'Icon') {
            theme.themes[0].graphic_ids.push(theme.attributes[i].value);
        }
    }

    for (let i = 0; i < theme.graphics.length; i++) {
        if (theme.graphics[i]) {
            if (theme.graphics[i].is_designer) {
                delete theme.graphics[i].is_designer;
            }

            if (theme.graphics[i].is_user_added) {
                delete theme.graphics[i].is_user_added;
            }

            if (theme.graphics[i].is_placeholder) {
                delete theme.graphics[i].is_placeholder;
            }

            if (theme.graphics[i].tags) {
                delete theme.graphics[i].tags;
            }
        }
    }
    const getFeatureName = getDesignerAddedFeatureName(theme.features);

    theme.features = obtainUpdatedBackgroundAndDesignerFeatures(
        theme
            .features
            .map((feature) =>
                Object.assign(
                    {},
                    feature,
                    { name: getFeatureName(feature) }
                )
            )
            .map((feature) =>
                Object
                    .keys(feature)
                    .reduce((acc, key) => {
                        if (key !== 'positionName') {
                            return Object.assign({}, acc, { [key]: feature[key] });
                        }
                        return acc;
                    }, {})
            )
    );

    for (let i = 0; i < theme.features.length; i++) {
        delete theme.features[i].design_id;
        // delete theme.features[i].deleted;

        if (theme.features[i].user_specific_information) {
            for (let j = 0; j < theme.attributes.length; j++) {
                if (theme.attributes[j] && theme.attributes[j].feature_id === theme.features[i].link) {
                    if (theme.attributes[j].name === 'Text' || theme.attributes[j].name === 'Icon') {
                        delete theme.attributes[j];
                    }
                }
            }
        }
    }

    theme.graphics = theme.graphics.filter(function (g) {
        return g !== undefined;
    });
    theme.attributes = theme.attributes.filter(function (a) {
        return a !== undefined;
    });

    theme.themes[0].graphic_ids = theme.themes[0].graphic_ids.filter(function (aid) {
        for (let i = 0; i < theme.graphics.length; i++) {
            if (theme.graphics[i].link === aid) {
                return true;
            }
        }
        return false;
    });

    theme.themes[0].attribute_ids = theme.themes[0].attribute_ids.filter(function (aid) {
        for (let i = 0; i < theme.attributes.length; i++) {
            if (theme.attributes[i].link === aid) {
                return true;
            }
        }
        return false;
    });

    return { theme, exporterVersion: version };
};

export default exportTheme;
